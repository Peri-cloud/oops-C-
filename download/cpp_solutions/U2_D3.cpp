#include <iostream>
#include <iomanip>
using namespace std;
int larger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
double larger(double a, double b) {
    if (a > b) {
        return a;
    }
    return b;
}
int larger(int a, int b, int c) {
    int m = a;
    if (b > m) {
        m = b;
    }
    if (c > m) {
        m = c;
    }
    return m;
}
int main() {
    int a, b, c;
    double x, y;
    cin >> a >> b >> c;
    cin >> x >> y;
    cout << fixed << setprecision(2);
    cout << "Larger of two integers: " << larger(a, b) << endl;
    cout << "Larger of two doubles: " << larger(x, y) << endl;
    cout << "Largest of three integers: " << larger(a, b, c) << endl;
    return 0;
}
