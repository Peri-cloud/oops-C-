#include <iostream>
using namespace std;
bool isPrime(int x) {
    if (x < 2) {
        return false;
    }
    for (int i = 2; i * i <= x; i++) {
        if (x % i == 0) {
            return false;
        }
    }
    return true;
}
int main() {
    int a, b;
    cin >> a >> b;
    int count = 0;
    int largest = 0;
    for (int i = a; i <= b; i++) {
        if (isPrime(i)) {
            count = count + 1;
            largest = i;
        }
    }
    cout << "Prime Count: " << count << endl;
    if (count == 0) {
        cout << "Largest Prime: None" << endl;
    } else {
        cout << "Largest Prime: " << largest << endl;
    }
    return 0;
}
