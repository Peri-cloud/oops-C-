#include <iostream>
#include <string>
using namespace std;
struct Node {
    int data;
    Node* left;
    Node* right;
};
Node* insert(Node* root, int value) {
    if (root == NULL) {
        Node* node = new Node;
        node->data = value;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }
    return root;
}
string searchResult(Node* root, int key) {
    Node* temp = root;
    while (temp != NULL) {
        if (key == temp->data) {
            return "Found";
        } else if (key < temp->data) {
            temp = temp->left;
        } else {
            temp = temp->right;
        }
    }
    return "Not Found";
}
int findMin(Node* root) {
    Node* temp = root;
    while (temp->left != NULL) {
        temp = temp->left;
    }
    return temp->data;
}
int findMax(Node* root) {
    Node* temp = root;
    while (temp->right != NULL) {
        temp = temp->right;
    }
    return temp->data;
}
int main() {
    int n, key;
    cin >> n;
    Node* root = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        root = insert(root, value);
    }
    cin >> key;
    cout << "Search: " << searchResult(root, key) << endl;
    cout << "Minimum: " << findMin(root) << endl;
    cout << "Maximum: " << findMax(root) << endl;
    return 0;
}
