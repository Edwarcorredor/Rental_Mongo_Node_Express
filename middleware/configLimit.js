import rateLimit from "express-rate-limit";
export let limitPet = ()=>{
    return rateLimit({
        windowMs: 30 * 1000,
        max: 5,
        standardHeaders: true, 
        legacyHeaders: false, 
      /*  skip: (req,res)=>{
            if(req.headers["content-length"]>120){
                res.status(413).send({
                    status:413, 
                    message: "Tamaño de la solicitud alcanzado"
                });
                return true;
            }
        }, */
        message: (req,res)=>{
            res.status(429).send({
                status: 429, 
                message: "Limite alcanzado"
            });
        }
    })    
}