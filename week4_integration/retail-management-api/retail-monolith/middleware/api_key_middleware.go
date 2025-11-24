package middleware

import (
	"os"
	"retail-management/model/web"

	"github.com/gofiber/fiber/v2"
)

func ApiKeyMiddleware() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		apiKey := ctx.Get("X-API-Key")
		validApiKey := os.Getenv("X_API_KEY")

		if validApiKey == "" || apiKey != validApiKey {
			return ctx.Status(fiber.StatusUnauthorized).JSON(web.WebResponse{
				Code:   fiber.StatusUnauthorized,
				Status: "UNAUTHORIZED",
				Data:   "Invalid or Missing API Key",
			})
		}

		return ctx.Next()
	}
}
