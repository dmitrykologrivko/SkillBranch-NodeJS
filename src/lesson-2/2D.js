import express from 'express'
import cors from 'cors'

const PORT = 3000;

const app = express();

// Config express
app.use(cors());

// Setup routes
app.get('/', (req, res) => {
    const ERROR_MESSAGE = 'Invalid color';
    const VALIDATE_HEX = new RegExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})\b$/);
    const VALIDATE_RGB = new RegExp(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const VALIDATE_HSL = new RegExp(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);

    /**
     * Inner function for convering color in HEX to color in RGB
     * @param hex color in HEX
     * @returns color in RGB 
     */
    const hex2Rgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
        if (result) {
            const r = parseInt(hex.length <= 4 ? result[4] + result[4] : result[1], 16);
            const g = parseInt(hex.length <= 4 ? result[5] + result[5] : result[2], 16);
            const b = parseInt(hex.length <= 4 ? result[6] + result[6] : result[3], 16);
            return `rgb(${r},${g},${b})`;
        } else {
            return null;
        }
    }

    /**
     * Inner function for convering color in HSL to color in RGB
     * @param hsl color in HSL
     * @returns color in RGB
     */
    const hsl2Rgb = (hsl) => {
        const result = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/i.exec(hsl);
        if (result) {
            let h = result[1];
            let s = result[2];
            let l = result[3];

            if (s > 100 || l > 100) {
                return null;
            }

            let r, g, b, m, c, x

            if (!isFinite(h)) h = 0
            if (!isFinite(s)) s = 0
            if (!isFinite(l)) l = 0

            h /= 60
            if (h < 0) h = 6 - (-h % 6)
            h %= 6

            s = Math.max(0, Math.min(1, s / 100))
            l = Math.max(0, Math.min(1, l / 100))

            c = (1 - Math.abs((2 * l) - 1)) * s
            x = c * (1 - Math.abs((h % 2) - 1))

            if (h < 1) {
                r = c
                g = x
                b = 0
            } else if (h < 2) {
                r = x
                g = c
                b = 0
            } else if (h < 3) {
                r = 0
                g = c
                b = x
            } else if (h < 4) {
                r = 0
                g = x
                b = c
            } else if (h < 5) {
                r = x
                g = 0
                b = c
            } else {
                r = c
                g = 0
                b = x
            }

            m = l - c / 2
            r = Math.round((r + m) * 255)
            g = Math.round((g + m) * 255)
            b = Math.round((b + m) * 255)

            return `rgb(${r},${g},${b})`;
        } else {
            return null;
        }
    }

    /**
     * Inner function for convering color in RGB model to color in HEX
     * @param rgb color in RGB
     * @returns color in HEX color
     */
    const rgb2Hex = (rgb) => {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(rgb);
        if (result) {
            if (result[1] > 255 || result[2] > 255 || result[3] > 255) {
                return null;
            }
            const r = parseInt(result[1], 10).toString(16);
            const g = parseInt(result[2], 10).toString(16);
            const b = parseInt(result[3], 10).toString(16);
            return "#" + (
                (r.length == 1 ? "0" + r : r) +
                (g.length == 1 ? "0" + g : g) +
                (b.length == 1 ? "0" + b : b)
            );
        } else {
            return null;
        }
    }

    // Get color param
    let color = req.query.color;

    // Check color
    if (color === undefined) {
        return res.send(ERROR_MESSAGE);
    }

    // Delete all spaces and convert to lowercase
    color = color.replace(/ /g, '').replace(/%20/g, '').toLowerCase();

    // Validate color
    if (color.match(VALIDATE_HEX)) {
        const rgb = hex2Rgb(color);
        if (rgb) {
            return res.send(rgb2Hex(rgb));
        } else {
            return res.send(ERROR_MESSAGE);
        }
    } else if (color.match(VALIDATE_RGB)) {
        const hex = rgb2Hex(color);
        if (hex) {
            return res.send(hex);
        } else {
            return res.send(ERROR_MESSAGE);
        }
    } else if (color.match(VALIDATE_HSL)) {
        const rgb = hsl2Rgb(color);
        if (rgb) {
            return res.send(rgb2Hex(rgb));
        } else {
            return res.send(ERROR_MESSAGE);
        }
    } else {
        return res.send(ERROR_MESSAGE);
    }
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});