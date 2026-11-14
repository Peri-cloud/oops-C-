#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left;
    Node *right;
};
Node *insert(Node *root, int x) {
    if (root == NULL) {
        Node *node = new Node;
        node->data = x;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (x < root->data) {
        root->left = insert(root->left, x);
    } else {
        root->right = insert(root->right, x);
    }
    return root;
}
int main() {
    int n, key;
    Node *root = NULL;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        root = insert(root, x);
    }
    cin >> key;
    Node *curr = root;
    int depth = 0;
    while (curr != NULL && curr->data != key) {
        if (key < curr->data) {
            curr = curr->left;
        } else {
            curr = curr->right;
        }
        depth++;
    }
    if (curr == NULL) {
        cout << "Not Found" << endl;
    } else {
        cout << "Found at depth " << depth << endl;
    }
    return 0;
}
