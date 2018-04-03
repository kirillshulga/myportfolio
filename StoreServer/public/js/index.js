$(document).ready(function(){
    var basket     = {},
        totalQ     = 0,
        totalPrice = 0;   
    
    $('.add-btn').on('click', function(event){
        var item     = $(event.target).closest('.item');
        var dataId   = item.attr('data-id');
        var title    = item.find('.item-info h5').text();
        var price    = +(item.find('.price').text());
        var quantity = +(item.find('.quantity').text());
        var fieldQ   = item.find('.q-ty');
        
        basket[dataId] = {
            title   : title,
            price   : price,
            inStock : quantity - 1,
            inCart  : 1
        };
        
        totalQ++;
        $('#totalQ').text(totalQ);
        $('#totalQPlace').show('slow');
        
        fieldQ.val(basket[dataId].inCart);
        $(event.target).css('display', 'none')
               .siblings().css('display', 'inline-block');
        
        if(basket[dataId].inStock === 0) {
                item.find('.plus-btn').addClass('disabled-btn');
            }
    });
    
    $('.plus-btn').on('click', function(event){
        var item     = $(event.target).closest('.item');
        var dataId   = item.attr('data-id');
        var fieldQ   = item.find('.q-ty');
        if(basket[dataId].inStock > 0) {
            basket[dataId].inStock--;
            basket[dataId].inCart++;
            totalQ++;
            $('#totalQ').text(totalQ);
            fieldQ.val(basket[dataId].inCart);
            if(basket[dataId].inStock === 0) {
                item.find('.plus-btn').addClass('disabled-btn');
            }
       }
    });
    
    $('.minus-btn').on('click', function(event){
        var item     = $(event.target).closest('.item');
        var dataId   = item.attr('data-id');
        var fieldQ   = item.find('.q-ty');
        if(basket[dataId].inCart > 0) {
            basket[dataId].inStock++;
            basket[dataId].inCart--;
            totalQ--;
            $('#totalQ').text(totalQ);
            fieldQ.val(basket[dataId].inCart);
            item.find('.plus-btn').removeClass('disabled-btn');
            if (basket[dataId].inCart === 0) {
                delete basket[dataId];
                item.find('.plus-btn').css('display', 'none');
                item.find('.minus-btn').css('display', 'none');
                item.find('.q-ty').css('display', 'none');
                item.find('.add-btn').css('display', 'block');
                if(Object.keys(basket).length === 0) {
                    $('#totalQPlace').hide('slow');
                }
            }
        } 
    });
    
    $('.cart').on('click', function(event){
        if(totalQ > 0){
            for(var item in basket){
                var tq = basket[item].price * basket[item].inCart;
                totalPrice += tq;
                var headerRow = $('.list-header');
                var newRow    = headerRow.clone();
                newRow.removeClass('list-header');
                newRow.find('.title-order').text(basket[item].title);
                newRow.find('.price-order').text(basket[item].price);
                newRow.find('.q-order').text('x' + basket[item].inCart);
                newRow.find('.tq-order').text(tq);
                headerRow.after(newRow); 
            }
//            console.log(basket);
//            console.log(totalPrice);
            $('.inTotal').text(totalPrice);
            $('.outer-modal').show("slow");
        }
    })
    
    $('.close-modal').on('click', function(event){
        $('.outer-modal').hide('slow');
        totalPrice = 0;
        $('.list-header ~ .item-row').remove();
    })
    
    $('#sendOrder').on('click', function(event){
        var name = $('#name').val();
        var phone = $('#phone').val();
        var email = $('#email').val();
        var readyOrder = {
            name:  name,
            phone: phone,
            email: email,
            totalPrice: totalPrice,
            goods: basket
        };
        console.log(readyOrder);
        $.ajax({
                url: '/',
                type: 'POST',
                data: readyOrder,
                success: function(res){
                    basket     = {};
                    totalQ     = 0;
                    totalPrice = 0;
                    $('.add-btn').css('display', 'block')
                    .siblings().css('display', 'none');
                    $('#totalQPlace').hide('slow');
                    $('.outer-modal').hide('slow');
                    $('.list-header ~ .item-row').remove();    
                }
            });
    })
});













