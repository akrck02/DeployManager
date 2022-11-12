
class Server {

    _express;
    _app;
    _params;

    constructor() {

        // Configuration gathering
        require('dotenv').config();
        this._params = {
            port: process.env.PORT, 
            host: process.env.IP,
            root: ".",
        };
        
        // Set up routing service
        this._express = require('express');
        this._app = this._express('app');

        // CORS management
        this._app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Oauth, Device");
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
        
    }

    /**
     * Set routes for projects 
     */
    setRoutes(){
       
        /*
        
        */        
        
    }


    /**
     * Serve the routes
     */
    serve() {
        
        const routes = {};
        const fs = require('fs');
        fs.readdir("./",(err,files) => {

            if(err) {
                console.error(err);
                return;
            }

            files.forEach(project => {
                
                if(fs.lstatSync(project).isDirectory()) {
                    
                    if (!fs.existsSync(project + "/web.json")) {
                        return;
                    } 
                    
                    console.log(`[INFO] ${ project } project found.`);
                    const webDecriptor = JSON.parse(fs.readFileSync(project + "/web.json",{encoding:'utf8', flag:'r'}));

                    for (const key in webDecriptor) {
                        routes["/" + project + "/" + key] = "./" + project + "/" + webDecriptor[key];
                    }

                }

            });


            // Add routes to routing service
            for (const endpoint in routes) {
                this._app.use(endpoint,this._express.static(routes[endpoint]));
                console.log(`[INFO] Asigning path ${endpoint} to ${routes[endpoint]}`);
            }

            // start webserver
            this._app.listen(this._params.port, () => {
                console.log(`[INFO] Web server listening on ${this._params.host}:${this._params.port}`)
            })


            
        })

       
    }


}

const server = new Server();
server.serve();
