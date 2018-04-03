$(document).ready(function(){
//    Добавление
    $('.add-btn').on('click', function(event){
        var modal  = $('#addModal');
        modal.css('display', 'block');
        
        $('#addItem').on('click', checkAndSend);
        
        $('.esc').on('click', cancelModal);
        
        function cancelModal(event){
            modal.css('display', 'none');
            clearInputs();
            $('#addItem').off('click', checkAndSend);    
        }
        function checkAndSend(event){
            $('#addItem').off('click', checkAndSend);
            var newItem = {
                title: $('#title').val(),
                price: $('#price').val(),
                quantity: $('#quantity').val(),
                description: $('#description').val()
            }
            $.ajax({
                url: 'admin',
                type: 'POST',
                data: newItem,
                success: function(data){
                    clearInputs();
                    modal.css('display', 'none');
                    $('#addItem').off('click', checkAndSend); 
                    createNewRow(data);
              }
            });
            
        }
        
        function clearInputs(){
            $('#title').val('');
            $('#price').val('');
            $('#quantity').val('');
            $('#description').val('');
        }
        
        function createNewRow(data) {
            if (!($('.container .row').eq(1).attr('data-id'))) {
                location.reload();
            } else {
                const lastRow = $('.container .row:last-child');
                var newRow    = $('.container .row').eq(1).clone(true);
                var children  = newRow.children();
                children.eq(0).text(data.title);
                children.eq(1).text(data.description);
                children.eq(2).text(data.quantity);
                children.eq(3).text(data.price);
                newRow.attr('data-id', data._id)
                      .insertBefore(lastRow);
            } 
        }
        
    })
    
        
//    Удаление
    $('.del').on('click', function(event){
        var item   = $(event.target).closest('.row');
        var dataId = item.attr('data-id');
        var title  = item.children().eq(0).text();
        var modal  = $('#delModal');
        $('#delModal .modal-body h4').eq(0).text(title);
        modal.css('display', 'block');
        
        $('.esc').on('click', cancelModal);
        
        function cancelModal(event){
            $('#delModal').css('display', 'none');
            $('#remove').off('click', submitModal);    
        }
        
        $('#remove').on('click', submitModal);
        
        function submitModal(event){
            $.ajax({
                url: 'admin/' + dataId,
                type: 'DELETE',
                success: function(){
                    modal.css('display', 'none');
                    item.remove();                    
              }
            });
            $('.esc').off('click', cancelModal);
        }
    });
    
//    Изменение
    $('.edit').on('click', function(event){
        var item   = $(event.target).closest('.row');
        var dataId = item.attr('data-id');
        $.ajax({
                url: 'admin/' + dataId,
                type: 'GET',
                success: function(data){
                    var modal  = $('#addModal');
                    modal.find(".modal-title").text(data.title + ": изменение");
                    modal.find("#addItem").text("Изменить");
                    modal.find("#title").val(data.title);
                    modal.find("#price").val(data.price);
                    modal.find("#quantity").val(data.quantity);
                    modal.find("#description").val(data.description);
                    modal.css('display', 'block');
                    
                    $('#addItem').on('click', checkAndSend);
        
                    $('.esc').on('click', cancelModal);  
                    
                    function cancelModal(event){
                        modal.css('display', 'none');
                        clearInputs();
                        modal.find(".modal-title").text("Добавление нового товара");
                        modal.find("#addItem").text("Добавить");
                        $('#addItem').off('click', checkAndSend);    
                    };
                    function checkAndSend(event){
                        $('#addItem').off('click', checkAndSend);
                        var newItem = {
                            title: $('#title').val(),
                            price: $('#price').val(),
                            quantity: $('#quantity').val(),
                            description: $('#description').val()
                        }
                        $.ajax({
                            url: 'admin/' + dataId,
                            type: 'PUT',
                            data: newItem,
                            success: function(data){
                                clearInputs();
                                modal.find(".modal-title").text("Добавление нового товара");
                                modal.find("#addItem").text("Добавить");
                                var children  = item.children();
                                children.eq(0).text(data.title);
                                children.eq(1).text(data.description);
                                children.eq(2).text(data.quantity);
                                children.eq(3).text(data.price);
                                modal.css('display', 'none');
                                $('#addItem').off('click', checkAndSend); 
                          }
                        });
                    };
                    function clearInputs(){
                        $('#title').val('');
                        $('#price').val('');
                        $('#quantity').val('');
                        $('#description').val('');
                    }
                    
              }
        });  
    });
    
    $('.itemImg').on('change', takeFile);
    function takeFile(e){
        var item   = $(event.target).closest('.row');
        var dataId = item.attr('data-id');
		var file = e.target.files[0];
        console.log(file);
		$.ajax({
			type:'POST',
			url: 'admin/' + dataId,
			data: file,
			processData: false,
			success: function(response) { 
				alert(response);
			}			
		});		
	};
    
});


