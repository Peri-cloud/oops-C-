#include <iostream>
using namespace std;
int main() {
    int n;
    int h[105];
    int size = 0;
    cin >> n;
    for (int k = 0; k < n; k++) {
        int x;
        cin >> x;
        h[size] = x;
        int i = size;
        size++;
        while (i > 0 && h[(i - 1) / 2] > h[i]) {
            int parent = (i - 1) / 2;
            int temp = h[parent];
            h[parent] = h[i];
            h[i] = temp;
            i = parent;
        }
    }
    cout << "Min-Heap:";
    for (int i = 0; i < size; i++) {
        cout << " " << h[i];
    }
    cout << endl;
    return 0;
}
