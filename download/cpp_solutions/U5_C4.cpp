#include <iostream>
using namespace std;
int n;
int adj[20][20];
bool visited[20];
int dfs(int u) {
    visited[u] = true;
    int size = 1;
    for (int v = 0; v < n; v++) {
        if (adj[u][v] == 1 && !visited[v]) {
            size = size + dfs(v);
        }
    }
    return size;
}
int main() {
    int m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u][v] = 1;
        adj[v][u] = 1;
    }
    int components = 0;
    int largest = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            int size = dfs(i);
            components = components + 1;
            if (size > largest) {
                largest = size;
            }
        }
    }
    cout << "Components: " << components << endl;
    cout << "Largest Component: " << largest << endl;
    if (components == 1) {
        cout << "Connected: Yes" << endl;
    } else {
        cout << "Connected: No" << endl;
    }
    return 0;
}
