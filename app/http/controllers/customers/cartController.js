function cartController(){
    return{
        index(req,res){
            return res.render('customers/cart')
        }
        
    }
}

module.exports = cartController