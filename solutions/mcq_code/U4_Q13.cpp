#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
void postorder(Node *p) {
    if (p == NULL)
        return;
    postorder(p->left);
    postorder(p->right);
    cout << p->data << " ";
}
int main() {
    Node n1 = {1, NULL, NULL}, n3 = {3, NULL, NULL}, n7 = {7, NULL, NULL};
    Node n2 = {2, &n1, &n3};
    Node n5 = {5, &n2, &n7};
    postorder(&n5);
    return 0;
}
