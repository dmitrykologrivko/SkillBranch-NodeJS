import express from 'express'
import cors from 'cors'

const PORT = 3000;

const app = express();

// Config express
app.use(cors());

// Setup routes
app.get('/', (req, res) => {
    /**
     * Inner function for capitalize string
     * For example: 
     * Input string: hello
     * Returned string: Hello
     */
    const capitalize = str => {
        if (str.length < 1) {
            return "";
        }
        return str.charAt(0).toUpperCase() + str.substr(1);
    };

    /**
     * Inner function for capitalize first latter from string
     * For example:
     * Input string: hello
     * Returned char: H
     */
    const capitalizeFirstChar = str => {
        if (str.length === 0) {
            return "";
        }
        return str.charAt(0).toUpperCase();
    };

    const ERROR_MESSAGE = 'Invalid fullname';
    const VALIDATE_PATTERN = new RegExp(/^[^0-9`~!@"№#$;%:?&*()_=+*.,<>{}/\\[\]]+$/);

    // Get fullname from query
    let fullname = req.query.fullname;

    // Check fullname
    if (fullname === undefined || fullname.length === 0) {
        res.send(ERROR_MESSAGE);
        return;
    }

    // Validate fullname
    if (!fullname.match(VALIDATE_PATTERN)) {
        res.send(ERROR_MESSAGE);
        return;
    }

    // Trim filename and convert to lowercase
    fullname = fullname.trim().toLowerCase();
    // Split fullname to array by space
    const fullnameArr = fullname.match(/\S+/g);
    
    // Check length of array
    if (fullnameArr.length === 1) {
        const lastname = capitalize(fullnameArr[0]);
        res.send(lastname);
        return;
    } else if (fullnameArr.length === 2) {
        const firstname = capitalizeFirstChar(fullnameArr[0]);
        const lastname = capitalize(fullnameArr[1]);
        res.send(`${lastname} ${firstname}.`);
        return;
    } else if (fullnameArr.length === 3) {
        const firstname = capitalizeFirstChar(fullnameArr[0]);
        const patronymic = capitalizeFirstChar(fullnameArr[1]);
        const lastname = capitalize(fullnameArr[2]);
        res.send(`${lastname} ${firstname}. ${patronymic}.`);
        return;
    } else {
        res.send(ERROR_MESSAGE);
        return;
    }
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});