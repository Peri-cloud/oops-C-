#include <iostream>
using namespace std;
struct Node {
    char op;
    int val;
    Node *left, *right;
};
int eval(Node *p) {
    if (p->left == NULL && p->right == NULL)
        return p->val;
    int l = eval(p->left);
    int r = eval(p->right);
    if (p->op == '+')
        return l + r;
    return l * r;
}
int main() {
    Node two = {'0', 2, NULL, NULL};
    Node three = {'0', 3, NULL, NULL};
    Node four = {'0', 4, NULL, NULL};
    Node plus = {'+', 0, &two, &three};
    Node mul = {'*', 0, &plus, &four};
    cout << eval(&mul);
    return 0;
}
