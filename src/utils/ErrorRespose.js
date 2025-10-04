class Apierror extends Error {
    constructor(statusCode, stack="", message="Error occured ", errors=[]) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors;
        this.success = false;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export default Apierror;
