$(function(){
    $('.favorite-item').on('submit', function(e){
        console.log('test');
        e.preventDefault();
        $.ajax({
            url: `/p/${username}/favorite`,
            method: 'POST',
            contentType: 'application/json',
            data: {
                coin: coin
            },
            success: function(res){
                console.log(res);
            }
        })
    })
})


