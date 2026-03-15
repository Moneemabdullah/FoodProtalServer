import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails: any = null;

    // Prisma validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Invalid or missing fields in request";
        errorDetails = err.message;
    }

    // Prisma known errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Record not found";
        } else if (err.code === "P2002") {
            statusCode = 409;
            errorMessage = "Duplicate key error";
        } else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed";
        }

        errorDetails = err.meta;
    }

    // Unknown prisma error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Database query error";
        errorDetails = err.message;
    }

    // Prisma initialization error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Database authentication failed";
        } else if (err.errorCode === "P1001") {
            statusCode = 500;
            errorMessage = "Cannot reach database server";
        }

        errorDetails = err.message;
    }

    // Standard JS error
    else if (err instanceof Error) {
        errorMessage = err.message;
        errorDetails = err.stack;
    }

    return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: errorDetails,
    });
}

export default errorHandler;
