import arcjet, { slidingWindow } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandartAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 180,
    })
  );

export const readSecurityMiddleware = base
  .$context<{ request: Request; user: KindeUser<Record<string, unknown>> }>()
  .middleware(async ({ context, next, errors }) => {
    const descision = await buildStandartAj().protect(context.request, {
      userId: context.user.id,
    });

    if (descision.isDenied()) {
      if (descision.reason.isRateLimit()) {
        errors.RATE_LIMITED({
          message: "Too many impactual changes. please slow down",
        });
      }

      throw errors.FORBIDDEN({
        message: "Request Blocked!",
      });
    }

    return next();
  });
