const asyncErrorWraper = require("express-async-handler");
const {populateHelper,paginationHelper} = require("./queryMiddlewareHelpers");

const answerQueryMiddleware = function(model,options){

    return asyncErrorWraper(async function(req,res,next){
    
       const {id} = req.params;

       const arrayName = "answers";

       const total = (await model.findById(id))["answerCount"];

       const paginationResult = await paginationHelper(total,undefined,req);

       const startIndex = paginationResult.startIndex;
       const limit = paginationResult.limit;

       let queryObject = {};

       queryObject[arrayName] = {$slice : [startIndex,limit]};

       let query = model.find({_id : id},queryObject);

       query = populateHelper(query,options.population);

       const queryResults = await query;

        res
        .queryResults = {
            succes : true,
            pagination : paginationResult.pagination,
            data : query
        }

        next();

    })

}


module.exports = answerQueryMiddleware;