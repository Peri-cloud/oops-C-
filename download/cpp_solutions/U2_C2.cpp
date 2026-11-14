#include <iostream>
using namespace std;
int divide(int a, int b) {
    if (b == 0) {
        throw 0;
    }
    return a / b;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        try {
            int q = divide(a, b);
            cout << a << " / " << b << " = " << q << endl;
        } catch (int code) {
            cout << a << " / " << b << " : Error: Division by zero" << endl;
        }
    }
    return 0;
}
