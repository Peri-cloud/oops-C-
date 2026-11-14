#include <iostream>
#include <string>
using namespace std;
int adj[20][20];
bool visited[20];
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
bool dfs(int n, int u, int parent) {
    visited[u] = true;
    for (int v = 0; v < n; v++) {
        if (adj[u][v] == 1) {
            if (!visited[v]) {
                if (dfs(n, v, u)) {
                    return true;
                }
            } else if (v != parent) {
                return true;
            }
        }
    }
    return false;
}
string hasCycle(int n) {
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfs(n, i, -1)) {
                return "Cycle Exists";
            }
        }
    }
    return "No Cycle";
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        addEdge(u, v);
    }
    cout << "Graph Check: " << hasCycle(n) << endl;
    return 0;
}
