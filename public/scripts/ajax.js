function toggleFavorite(coin){
    var star = document.getElementById('favorite-' + coin);
    if(star.innerHTML === 'star')
        star.innerHTML = 'star_border';
    else
        star.innerHTML = 'star';
    var xht = new XMLHttpRequest();
    xht.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            console.log(coin);
        }
    };
    xht.open('POST', '/favorite', true);
    xht.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xht.send('coin=' + coin);
}

