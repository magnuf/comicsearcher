module.exports = navigateOnKey;

function navigateOnKey ({ prev, next, cancel }) {
  return (e) => {
    if (e.keyCode == 38) {
        e.preventDefault(); // prevent scrolling up
        prev();
    }
    else if (e.keyCode == 40) {
        e.preventDefault(); // prevent scrolling down
        next();
    }
    else if (e.keyCode == 27) {
        cancel();
    }
    else if (e.keyCode == 9) {
        e.preventDefault(); // keep track ourselves
        if (e.shiftKey) prev();
        else next();
    }
  };
};
