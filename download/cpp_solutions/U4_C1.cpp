#include <iostream>
using namespace std;
int n;
int leftChild[50];
int rightChild[50];
int height(int node) {
    if (node == -1) {
        return -1;
    }
    int l = height(leftChild[node]);
    int r = height(rightChild[node]);
    if (l > r) {
        return l + 1;
    }
    return r + 1;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> leftChild[i] >> rightChild[i];
    }
    int leaves = 0;
    bool full = true;
    for (int i = 0; i < n; i++) {
        if (leftChild[i] == -1 && rightChild[i] == -1) {
            leaves = leaves + 1;
        } else if (leftChild[i] == -1 || rightChild[i] == -1) {
            full = false;
        }
    }
    cout << "Nodes: " << n << endl;
    cout << "Leaves: " << leaves << endl;
    cout << "Height: " << height(0) << endl;
    if (full) {
        cout << "Full Binary Tree: Yes" << endl;
    } else {
        cout << "Full Binary Tree: No" << endl;
    }
    return 0;
}
