#include <iostream>
#include <string>
using namespace std;
int graph[20][20];
void addEdge(int u, int v, int w) {
    graph[u][v] = w;
    graph[v][u] = w;
}
void dijkstra(int n, int source, int dist[]) {
    bool done[20];
    for (int i = 0; i < n; i++) {
        dist[i] = 1000000000;
        done[i] = false;
    }
    dist[source] = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && dist[v] != 1000000000 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = true;
        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !done[v] && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
}
void printDistances(int n, int dist[]) {
    cout << "Distances:";
    for (int i = 0; i < n; i++) {
        if (dist[i] == 1000000000) {
            cout << " INF";
        } else {
            cout << " " << dist[i];
        }
    }
    cout << endl;
}
int main() {
    int n, m, source;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    cin >> source;
    int dist[20];
    dijkstra(n, source, dist);
    printDistances(n, dist);
    return 0;
}
