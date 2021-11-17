package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// End Points

// Lists all data
// http://localhost/recom

// List all criterias for pariticular recommendation
// http://localhost/recom/STR-3

// List must have criterias
// http://localhost/must

// list data for list of ids
// http://localhost/summary/STR-1.04,SPC-4.03,ARCH-7.02,CTN-1.01,UX-UI-1.01

type Entry struct {
	ID         string `gorm:"index" json:"id"`
	Category   string `json:"category"`
	Recom      string `json:"recom"`
	Planet     string `json:"planet"`
	People     string `json:"people"`
	Prosperity string `json:"prosperity"`
	PPP        string `json:"ppp"`
	Family     string `json:"family"`
	Keystep1   string `json:"keystep1"`
	Criteria   string `json:"criteria"`
	Keystep2   string `json:"keystep2"`
	Outcome1   string `json:"outcome1"`
	Type       string `json:"type"`
	Difficulty string `json:"difficulty"`
	Must_have  string `json:"must_have"`
	Lifecycle  string `json:"lifecycle"`
	Priority   string `json:"prioity"`
	Recurre    string `json:"recurre"`
	Outcome2   string `json:"outcome2"`
}

type Criteria struct {
	ID       string
	Criteria string
	Type     string
	Category string
}

type App struct {
	DB *gorm.DB
}

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}

func (a *App) Initialize(dbURI string) {
	db, err := gorm.Open(sqlite.Open(dbURI), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	a.DB = db

	// Migrate the schema.
	a.DB.AutoMigrate(&Entry{})
}

func (a *App) ListHandler(w http.ResponseWriter, r *http.Request) {

	var entry []Entry

	a.DB.Raw("SELECT * FROM entries").Scan(&entry)
	entryJSON, _ := json.Marshal(entry)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(entryJSON))
}

func (a *App) ViewHandler(w http.ResponseWriter, r *http.Request) {

	//Example
	// http://localhost/recom/STR-3

	vars := mux.Vars(r)
	id := vars["id"]
	var criteria []Criteria

	a.DB.Raw("SELECT id, Criteria, Type, Category  FROM entries Where Recom = ?", id).Scan(&criteria)
	criteriaJSON, _ := json.Marshal(criteria)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(criteriaJSON))
}

func (a *App) MustHandler(w http.ResponseWriter, r *http.Request) {

	var criteria []Criteria

	a.DB.Raw("SELECT id, Criteria, Type, Category  FROM entries Where must_have = 1").Scan(&criteria)
	criteriaJSON, _ := json.Marshal(criteria)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(criteriaJSON))
}

func (a *App) SummaryHandler(w http.ResponseWriter, r *http.Request) {

	//Example
	// http://localhost/summary/STR-1.04,SPC-4.03,ARCH-7.02,CTN-1.01,UX-UI-1.01

	vars := mux.Vars(r)
	id_list := strings.Split(vars["id_list"], ",")
	var entry []Entry

	a.DB.Raw("SELECT *  FROM entries Where id IN (?)", id_list).Scan(&entry)
	entryJSON, _ := json.Marshal(entry)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(entryJSON))
}

func main() {
	a := &App{}
	a.Initialize("data.db")

	r := mux.NewRouter()

	r.HandleFunc("/recom", a.ListHandler).Methods("GET")
	r.HandleFunc("/recom/{id:.+}", a.ViewHandler).Methods("GET")
	r.HandleFunc("/must", a.MustHandler).Methods("GET")
	r.HandleFunc("/summary/{id_list:.+}", a.SummaryHandler).Methods("GET")

	fileserver := http.FileServer(http.Dir("./public/"))
	r.PathPrefix("/").Handler(fileserver)
	http.Handle("/", r)

	fmt.Println("Listening on port 80")
	if err := http.ListenAndServe(":80", logRequest(http.DefaultServeMux)); err != nil {
		panic(err)
	}
}
