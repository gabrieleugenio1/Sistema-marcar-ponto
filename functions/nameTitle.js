module.exports = (nome) => {
  if(nome){
    return nome.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
};
