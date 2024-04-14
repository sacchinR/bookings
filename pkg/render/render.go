package render

import (
	"bytes"
	"html/template"
	"log"
	"net/http"
	"path/filepath"

	"github.com/sacchinr/bookings/pkg/config"
	"github.com/sacchinr/bookings/pkg/models"
)

var app *config.AppConfig

// NewTemplates sets the config for the template package
func NewTemplates(a *config.AppConfig) {
	app = a
}

func AddDefaultData(td *models.TemplateData) *models.TemplateData {
	return td
}

// RenderTemplate using html template
func RenderTemplate(w http.ResponseWriter, html string, td *models.TemplateData) {
	var tc map[string]*template.Template
	if app.UseCache {
		// get the template cache from teh app config
		tc = app.TemplateCache

	} else {
		tc, _ = CreateTemplateCache()
	}

	// create a template cache
	// tc, err := CreateTemplateCache()
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// get requested template from cache
	t, ok := tc[html]
	if !ok {
		log.Fatal("could not get template from template cache")
	}

	buf := new(bytes.Buffer)

	td = AddDefaultData(td)

	_ = t.Execute(buf, td) // TODO: pass data to the templates

	// render the template

	_, err := buf.WriteTo(w)
	if err != nil {
		log.Println(err)
	}

	// parsedTemplete, _ := template.ParseFiles("./templates/"+html, "./templates/base.layout.html")
	// err := parsedTemplete.Execute(w, nil)
	// if err != nil {
	// 	fmt.Println("Error parsing template: ", err)
	// 	return
	// }
}

func CreateTemplateCache() (map[string]*template.Template, error) {
	myCache := map[string]*template.Template{}
	// get all of the files named *.page.html from ./templates
	pages, err := filepath.Glob("./templates/*.page.html")
	if err != nil {
		return myCache, err
	}

	// range through all files ending with *.page.html
	for _, page := range pages {
		name := filepath.Base(page) // extracts the base name of the path, e.g. home.page.html -> home
		ts, err := template.New(name).ParseFiles(page)
		if err != nil {
			return myCache, err
		}
		matches, err := filepath.Glob("./templates/*.layout.html")
		if err != nil {
			return myCache, err
		}

		if len(matches) > 0 {
			ts, err = ts.ParseGlob("./templates/*.layout.html")
			if err != nil {
				return myCache, err
			}
		}

		myCache[name] = ts
	}
	return myCache, nil

}

// var tc = make(map[string]*template.Template)

// func RenderTemplate(w http.ResponseWriter, t string) {
// 	var tmpl *template.Template
// 	var err error

// 	// check to see if we already have the template in our cache
// 	_, inMap := tc[t]
// 	if !inMap {
// 		// need to create the template
// 		log.Println("creating template and adding to cache")
// 		err = createTemplateCache(t)
// 		if err != nil {
// 			log.Println(err)
// 		}
// 	} else {
// 		// we have the template in the cache
// 		log.Println("using cached template")
// 	}

// 	tmpl = tc[t]
// 	err = tmpl.Execute(w, nil)
// 	if err != nil {
// 		log.Println(err)
// 	}
// }

// func createTemplateCache(t string) error {
// 	templates := []string{
// 		fmt.Sprintf("./templates/%s", t),
// 		"./templates/base.layout.html",
// 	}

// 	// parse the template
// 	tmpl, err := template.ParseFiles(templates...)
// 	if err != nil {
// 		return err
// 	}

// 	// add template to cache (map)
// 	tc[t] = tmpl
// 	return nil
// }
