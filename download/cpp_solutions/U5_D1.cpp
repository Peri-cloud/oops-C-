#include <iostream>
#include <string>
using namespace std;
int adj[20][20];
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
void printList(int n) {
    for (int i = 0; i < n; i++) {
        cout << i << ":";
        for (int j = 0; j < n; j++) {
            if (adj[i][j] == 1) {
                cout << " " << j;
            }
        }
        cout << endl;
    }
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        addEdge(u, v);
    }
    printList(n);
    return 0;
}
