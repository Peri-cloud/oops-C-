#include <iostream>
#include <iomanip>
using namespace std;
class Box {
    double l, w, h;
public:
    Box() {
        l = 1;
        w = 1;
        h = 1;
    }
    Box(double side) {
        l = side;
        w = side;
        h = side;
    }
    Box(double a, double b, double c) {
        l = a;
        w = b;
        h = c;
    }
    double volume() {
        return l * w * h;
    }
};
int main() {
    double side, a, b, c;
    cin >> side >> a >> b >> c;
    Box first;
    Box second(side);
    Box third(a, b, c);
    cout << fixed << setprecision(2);
    cout << "Default Box Volume: " << first.volume() << endl;
    cout << "Cube Volume: " << second.volume() << endl;
    cout << "Box Volume: " << third.volume() << endl;
    return 0;
}
