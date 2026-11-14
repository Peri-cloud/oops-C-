#include <iostream>
using namespace std;
int n;
char color[50];
int leftChild[50];
int rightChild[50];
int blackHeight(int node) {
    if (node == -1) {
        return 0;
    }
    if (color[node] == 'R') {
        if (leftChild[node] != -1 && color[leftChild[node]] == 'R') {
            return -1;
        }
        if (rightChild[node] != -1 && color[rightChild[node]] == 'R') {
            return -1;
        }
    }
    int l = blackHeight(leftChild[node]);
    int r = blackHeight(rightChild[node]);
    if (l == -1 || r == -1 || l != r) {
        return -1;
    }
    if (color[node] == 'B') {
        return l + 1;
    }
    return l;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        int key;
        cin >> key >> color[i] >> leftChild[i] >> rightChild[i];
    }
    if (color[0] == 'R') {
        cout << "Invalid Red-Black Tree" << endl;
        return 0;
    }
    int bh = blackHeight(0);
    if (bh == -1) {
        cout << "Invalid Red-Black Tree" << endl;
    } else {
        cout << "Valid Red-Black Tree" << endl;
        cout << "Black Height: " << bh << endl;
    }
    return 0;
}
