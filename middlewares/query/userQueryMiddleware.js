const asyncErrorWraper = require("express-async-handler");
const {searchHelper,paginationHelper} = require("./queryMiddlewareHelpers");

const userQueryMiddleware = function(model,options){

    return asyncErrorWraper(async function(req,res,next){
    
        let query = model.find();

        //Search by name

        query = searchHelper("name",query,req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults = {
            succsess : true,
            pagination : pagination,
            count : queryResults.length,
            data : queryResults
        }

        next();

    })

}


module.exports = userQueryMiddleware;