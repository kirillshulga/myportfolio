module.exports = function(app, db) {
    const myDB = db.db('shul_store');
    const collectionGoods = myDB.collection('goods');
    const collectionOrders = myDB.collection('orders');
    
//    Отрисовка страницы каталога
    app.get('/', (req, res) => {
        collectionGoods.find({}).toArray((err, result) => {
            res.render('index', {item:result});
        });
    });
    
    
//    Принимаем данные формы
    app.post('/', (req, res) => {
        console.log(req);
        const order = { name: req.body.name, phone: req.body.phone, email: req.body.email, goods: req.body.goods, totalPrice: req.body.totalPrice, status: "new" };
        collectionOrders.insert(order, (err, result) => {
            if (err) { 
                res.send({ 'error': 'An error has occurred' }); 
            } else {
                res.send(result.ops[0]);
            }
        });
    });
    
};