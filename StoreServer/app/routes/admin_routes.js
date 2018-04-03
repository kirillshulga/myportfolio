var ObjectID = require('mongodb').ObjectID;
var http     = require("http");
const logins = require('../../config/logins');
var fs       = require('fs');
var url      = require("url");
var path     = require('path');
//var mimeTypes = {
//	'.js' : 'text/javascript',
//	'.html' : 'text/html',
//	'.css' : 'text/css' ,
//	'.jpg' : 'image/jpeg',
//	'.gif' : 'image/gif'
//};

module.exports = function(app, db) {
    const myDB = db.db('shul_store');
    const collectionGoods = myDB.collection('goods');
    const collectionOrders = myDB.collection('orders');
    var hashStorage = {};
    
//    Отрисовка страницы админки
    app.get('/admin', (req, res) => {
        var cookie = parseCookies(req);
        if (cookie.authHash && cookie.authHash === hashStorage.value) {
            collectionGoods.find({}).toArray((err, result) => {
                res.render('admin', {item:result});
            }); 
        } else {
            res.render('auth'); 
        }
    });
    
//    Запрос с логином и паролем, авторизация
    app.post('/auth', (req, res) => {
        if(req.body.login === logins.admin.login && req.body.pass === logins.admin.pass) {
            if(hashStorage.value){
                res.cookie('authHash', hashStorage.value);
            } else {
                var newHash = uniqHash().toString();
                res.cookie('authHash', newHash);
                hashStorage.value = newHash;
            }
            collectionGoods.find({}).toArray((err, result) => {
                res.render('admin', {item:result});
            });
        } else {
            res.render('auth', { danger:true, wrong:true });
        }  
    });
    
//    Перенаправление в случае обращения к адресу /auth
    app.get('/auth', (req, res) => {
        var cookie = parseCookies(req);
        if (cookie.authHash && cookie.authHash === hashStorage.value) {
            res.redirect('/admin');
        } else {
            res.render('auth'); 
        }
    });
    
//    Выход
    app.get('/logout', (req, res) => {
        res.clearCookie('authHash');
        res.redirect('/admin');        
    })
    
//    Отрисовка страницы заказов
    app.get('/admin/orders', (req, res) => {
        var cookie = parseCookies(req);
        if (cookie.authHash && cookie.authHash === hashStorage.value) {
            collectionOrders.find({}).toArray((err, result) => {
                res.render('orders', {order:result});
            });
        } else {
            res.render('auth',{ up: true}); 
        }
    });
    
//    Удаление заказа
    app.delete('/admin/orders/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        collectionOrders.remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            } 
        });
    })
    
    app.get('/admin/orders/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        collectionOrders.findOne(details, (err, item) => {
           if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log(item.goods);
                var listOfGoods = {};
                for(var key in item.goods) {
                    const details = {'_id': new ObjectID(key)};
                    collectionGoods.findOne(details, (err, item) => {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                           listOfGoods[key] = JSON.stringify(item);
//                            console.log(listOfGoods[key]);
                        }
//                    console.log(key);
//                    console.log(item);
                    })
                }
                res.send(JSON.stringify(listOfGoods));
            }
        })
    })    
    
//    Чтение
    app.get('/admin/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        collectionGoods.findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
    
//    Добавление
    app.post('/admin', (req, res) => {
        const product = { title: req.body.title, price: req.body.price, quantity: req.body.quantity, description: req.body.description };
        collectionGoods.insert(product, (err, result) => {
            if (err) { 
                res.send({ 'error': 'An error has occurred' }); 
            } else {
                res.send(result.ops[0]);
            }
        });
    });
    
//    Добавление изображения
    app.post('/admin/:id', (req, res) => {
        console.log("post for img");
        var newFileStream = fs.createWriteStream('SUncQc5C4v0.jpg');
        console.log(req);
        newFileStream.write(req.body.data);
    });
    
//    Удаление
    app.delete('/admin/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        collectionGoods.remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Product ' + id + ' deleted!');
            } 
        });
    });
    
    //    Изменение
    app.put('/admin/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const product = { title: req.body.title, price: req.body.price, quantity: req.body.quantity, description: req.body.description };
        collectionGoods.update(details, product, (err, result) => {
            if (err) { 
                res.send({ 'error': 'An error has occurred' }); 
            } else {
                res.send(product);
            }
        });
    });
    
    function parseCookies (request) {
        var list = {},
            rc = request.headers.cookie;

        rc && rc.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    };
    
    function uniqHash() {
        var hash = 0,
            k = new Date,
            j;
        j = k.toString();
        for (i = 0; i < j.length; i++) {
            var chr   = j.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
      return hash;
    }
//    Каждые три часа хэш обновляется и необходимо заново авторизоваться
    setInterval(function(){
        var newHash = uniqHash().toString();
        hashStorage.value = newHash;
    }, 10800000)    
};