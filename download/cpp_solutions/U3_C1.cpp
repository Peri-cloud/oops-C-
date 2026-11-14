#include <iostream>
using namespace std;
int n;
int a[105];
int res[105];
int cnt;
void preorder(int i) {
    if (i >= n) {
        return;
    }
    res[cnt++] = a[i];
    preorder(2 * i + 1);
    preorder(2 * i + 2);
}
void inorder(int i) {
    if (i >= n) {
        return;
    }
    inorder(2 * i + 1);
    res[cnt++] = a[i];
    inorder(2 * i + 2);
}
void postorder(int i) {
    if (i >= n) {
        return;
    }
    postorder(2 * i + 1);
    postorder(2 * i + 2);
    res[cnt++] = a[i];
}
void show(const char *label) {
    cout << label << ":";
    for (int i = 0; i < cnt; i++) {
        cout << " " << res[i];
    }
    cout << endl;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    cnt = 0;
    preorder(0);
    show("Preorder");
    cnt = 0;
    inorder(0);
    show("Inorder");
    cnt = 0;
    postorder(0);
    show("Postorder");
    return 0;
}
