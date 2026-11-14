#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
Node* insert(Node *root, int key) {
    if (root == NULL) {
        Node *n = new Node;
        n->data = key;
        n->left = n->right = NULL;
        return n;
    }
    if (key < root->data)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}
int main() {
    Node *root = NULL;
    int keys[] = {50, 30, 70, 20, 40};
    for (int i = 0; i < 5; i++)
        root = insert(root, keys[i]);
    cout << root->left->right->data << " " << root->right->data;
    return 0;
}
