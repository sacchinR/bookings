package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/sacchinr/bookings/pkg/config"
	"github.com/sacchinr/bookings/pkg/handlers"
	"github.com/sacchinr/bookings/pkg/render"
)

const portNumber string = ":8080"

var app config.AppConfig
var session *scs.SessionManager

// main is the main application function
func main() {

	// change this to tur when in production
	app.InProduction = false

	session = scs.New()
	session.Lifetime = 24 * time.Hour
	session.Cookie.Persist = true
	session.Cookie.SameSite = http.SameSiteLaxMode
	session.Cookie.Secure = app.InProduction

	app.Session = session

	tc, err := render.CreateTemplateCache()

	if err != nil {
		log.Fatal("cannot create tempate cache")
	}

	app.TemplateCache = tc
	app.UseCache = true

	repo := handlers.NewRepo(&app)
	render.NewTemplates(&app)
	handlers.NewHandlers(repo)

	fmt.Println(fmt.Sprintf("starting application on part %s", portNumber))
	// http.ListenAndServe(portNumber, nil) // listen on port 80
	srv := &http.Server{
		Addr:    portNumber,
		Handler: routes(&app),
	}
	err = srv.ListenAndServe()
	if err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
