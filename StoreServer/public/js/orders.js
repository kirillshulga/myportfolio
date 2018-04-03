$(document).ready(function(){
    
//    Удаление
    $('.del').on('click', function(event){
        var item   = $(event.target).closest('.row');
        var dataId = item.attr('data-order-id');
        var title  = item.children().eq(1).text();
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
                url: 'orders/' + dataId,
                type: 'DELETE',
                success: function(){
                    modal.css('display', 'none');
                    item.remove();                    
              }
            });
            $('.esc').off('click', cancelModal);
        }
    })
});