#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
int main() {
    Node n10 = {10, NULL, NULL};
    Node n20 = {20, &n10, NULL};
    Node n30 = {30, &n20, NULL};
    Node *y = &n30;
    Node *x = y->left;
    y->left = x->right;
    x->right = y;
    cout << x->data << " " << x->left->data << " " << x->right->data;
    return 0;
}
