// Brian map test via map object

var myMap = new Map();

var t_other = new Date(),
    t_target = new Date();

t_other.setDate(t_other.getDate() + 1);
// setting the values
myMap.set(t_other, "rate assoc with other");
myMap.set(t_target, "rate assoc with target");

myMap.size; // 3

// getting the values
console.log(myMap.get(t_other) + ": " + t_other.toString());	// "value associated with 'a string'"
console.log(myMap.get(t_target) + ": " + t_target.toString());	// "value associated with keyObj"
console.log(t_other > t_target);