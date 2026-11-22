"""
VidCompress - Local dev server with HTTP Range request support.
Required for HTML5 video seeking (compressed videos served over HTTP).
"""
import http.server
import os
import sys
import mimetypes

PORT = 8000

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler that supports Range requests for video seeking."""

    def send_head(self):
        path = self.translate_path(self.path)

        if os.path.isdir(path):
            return super().send_head()

        if not os.path.isfile(path):
            self.send_error(404, "File not found")
            return None

        # Get file size
        file_size = os.path.getsize(path)
        content_type, _ = mimetypes.guess_type(path)
        if content_type is None:
            content_type = 'application/octet-stream'

        # Check for Range header
        range_header = self.headers.get('Range')

        if range_header:
            try:
                # Parse "bytes=start-end"
                range_spec = range_header.strip().split('=')[1]
                parts = range_spec.split('-')
                start = int(parts[0]) if parts[0] else 0
                end = int(parts[1]) if parts[1] else file_size - 1

                # Clamp values
                start = max(0, start)
                end = min(end, file_size - 1)
                content_length = end - start + 1

                self.send_response(206)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(content_length))
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                f = open(path, 'rb')
                f.seek(start)
                # Return a wrapper that only reads the requested range
                return _RangeFile(f, content_length)

            except (ValueError, IndexError):
                self.send_error(416, 'Invalid Range')
                return None
        else:
            # Normal full-file response, but advertise Range support
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            return open(path, 'rb')

    def do_HEAD(self):
        """Handle HEAD requests with Accept-Ranges header."""
        f = self.send_head()
        if f:
            f.close()

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range')
        self.end_headers()


class _RangeFile:
    """Wraps a file object to limit reads to a byte range."""

    def __init__(self, f, remaining):
        self.f = f
        self.remaining = remaining

    def read(self, n=-1):
        if self.remaining <= 0:
            return b''
        if n < 0 or n > self.remaining:
            n = self.remaining
        data = self.f.read(n)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    handler = RangeHTTPRequestHandler
    with http.server.HTTPServer(('', port), handler) as httpd:
        print(f'Serving on http://localhost:{port}  (Range requests enabled)')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped.')
