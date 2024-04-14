package main

import (
	"fmt"
	"net/http"

	"github.com/justinas/nosurf"
)

func WriteToConsole(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Hit the page")
		next.ServeHTTP(w, r) // Call the next handler in the chain
	})
}

// NoSurf add CSRF protection to all post requests
func NoSurf(next http.Handler) http.Handler {
	csrfHandler := nosurf.New(next)
	// Set the CSRF token cookie

	csrfHandler.SetBaseCookie(http.Cookie{
		HttpOnly: true,
		Path:     "/",
		Secure:   app.InProduction,
		SameSite: http.SameSiteLaxMode,
	})
	return csrfHandler
}

// SessionLoad loads and save the sessions on every request
func SessionLoad(next http.Handler) http.Handler {
	return session.LoadAndSave(next)
}
