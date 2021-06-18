use std::{env::current_dir, io};

fn main() {
    println!("Hello, world!");
    
    println!("Guess the number!");
    
    println!("Please input your guess.");

    let dir = current_dir().expect("Cant read the current path");
    let mut guess = String::new();

    println!("Current dir is: {:?}", dir);
    
    io::stdin()
        .read_line(&mut guess)
        .expect("Filed to read line");
    
    println!("You guessed: {}", guess)
}
