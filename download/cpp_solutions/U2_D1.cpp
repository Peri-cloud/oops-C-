#include <iostream>
using namespace std;
class Complex {
    int real;
    int imag;
public:
    Complex(int r, int i) {
        real = r;
        imag = i;
    }
    Complex operator+(Complex other) {
        return Complex(real + other.real, imag + other.imag);
    }
    Complex operator*(Complex other) {
        return Complex(real * other.real - imag * other.imag, real * other.imag + imag * other.real);
    }
    void display() {
        cout << "(" << real << ", " << imag << ")" << endl;
    }
};
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    Complex first(a, b);
    Complex second(c, d);
    Complex sum = first + second;
    Complex product = first * second;
    cout << "Sum: ";
    sum.display();
    cout << "Product: ";
    product.display();
    return 0;
}
