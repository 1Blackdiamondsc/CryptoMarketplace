function toggleFavorite(coin){
    var xht = new XMLHttpRequest();
    xht.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            var coinRowFav = document.getElementById(coin + '-fav-body');
            var coinRow = document.getElementById(coin);
            if(coinRow.style.display === 'none'){
                coinRow.style.display = 'table-row';
                coinRowFav.style.display = 'none';
            } else {
                coinRow.style.display = 'none';
                coinRowFav.style.display = 'table-row';
            }
        }
    };
    xht.open('POST', '/favorite', true);
    xht.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xht.send('coin=' + coin);
}

