import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "SALES"
  | "ADS_MANAGER"
  | "CLIENT"
  | "USER";

interface JWTPayload {
  id: number;
  role: UserRole;
  email: string;
}

export function verifyToken(requiredRoles: UserRole[] = []) {
  return (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return {
          error: NextResponse.json(
            { message: "Authorization header missing or invalid" },
            { status: 401 },
          ),
        };
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return {
          error: NextResponse.json(
            { message: "Token not found" },
            { status: 401 },
          ),
        };
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        console.error("JWT_SECRET is not defined");
        return {
          error: NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
          ),
        };
      }

      const decoded = jwt.verify(token, secret) as JWTPayload;

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return {
          error: NextResponse.json(
            {
              message: `Access denied. Required role: ${requiredRoles.join(
                ", ",
              )}`,
            },
            { status: 403 },
          ),
        };
      }

      return { user: decoded };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return {
          error: NextResponse.json(
            { message: "Token has expired" },
            { status: 401 },
          ),
        };
      }

      if (error.name === "JsonWebTokenError") {
        return {
          error: NextResponse.json(
            { message: "Invalid token" },
            { status: 401 },
          ),
        };
      }

      return {
        error: NextResponse.json(
          { message: "Token verification failed" },
          { status: 401 },
        ),
      };
    }
  };
}
