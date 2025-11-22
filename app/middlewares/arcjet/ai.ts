import aj, { detectBot, sensitiveInfo, shield, slidingWindow } from "@/lib/arcjet"
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const buildAiAj = () => aj.withRule(
    shield({
        mode: 'LIVE'
    })
).withRule(
    slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max:3
    })
).withRule(
    detectBot({
        mode:'LIVE',
        allow:['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']
    })
).withRule(
    sensitiveInfo({
        mode:'LIVE',
        deny:['PHONE_NUMBER', 'CREDIT_CARD_NUMBER']
    })
)


export const aiSecurityMiddleware = base
  .$context<{ request: Request; user: KindeUser<Record<string, unknown>> }>()
  .middleware(async ({ context, next, errors }) => {
    const descision = await buildAiAj().protect(context.request, {
      userId: context.user.id,
    });

    if (descision.isDenied()) {
      if (descision.reason.isSensitiveInfo()) {
        errors.BAD_REQUEST({
          message: "Sensitive Information detected. please remove PII (e.g. credit card data, phone numbers)",
        });
      }

     if(descision.reason.isRateLimit()){
      throw errors.RATE_LIMITED({
        message:'Too many request. Please wait and try again.'
      })
     }

     if(descision.reason.isBot()){
        throw errors.FORBIDDEN({
          message: "Automated traffic blocked",
        });
     }

     if(descision.reason.isShield()){
         throw errors.FORBIDDEN({
           message: "Request blocked by security policy (WAF)",
         });
     }

     throw errors.FORBIDDEN({ message: 'Request blocked'})
    }

    return next();
  });
