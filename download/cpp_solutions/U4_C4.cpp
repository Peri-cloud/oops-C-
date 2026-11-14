#include <iostream>
using namespace std;
int val[20];
int leftChild[20];
int rightChild[20];
int height(int node) {
    if (node == -1) {
        return 0;
    }
    int l = height(leftChild[node]);
    int r = height(rightChild[node]);
    if (l > r) {
        return l + 1;
    }
    return r + 1;
}
int balance(int node) {
    return height(leftChild[node]) - height(rightChild[node]);
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> val[i];
        leftChild[i] = -1;
        rightChild[i] = -1;
        if (i > 0) {
            int cur = 0;
            while (true) {
                if (val[i] < val[cur]) {
                    if (leftChild[cur] == -1) {
                        leftChild[cur] = i;
                        break;
                    }
                    cur = leftChild[cur];
                } else {
                    if (rightChild[cur] == -1) {
                        rightChild[cur] = i;
                        break;
                    }
                    cur = rightChild[cur];
                }
            }
        }
    }
    int bf = balance(0);
    cout << "Balance Factor: " << bf << endl;
    if (bf > 1) {
        if (balance(leftChild[0]) >= 0) {
            cout << "Rotation: LL" << endl;
        } else {
            cout << "Rotation: LR" << endl;
        }
    } else if (bf < -1) {
        if (balance(rightChild[0]) <= 0) {
            cout << "Rotation: RR" << endl;
        } else {
            cout << "Rotation: RL" << endl;
        }
    } else {
        cout << "Rotation: None" << endl;
    }
    return 0;
}
