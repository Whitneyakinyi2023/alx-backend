### Learning Objectives: Cache Replacement Policies

#### General Overview:
- **What a caching system is:**
  A caching system is a component that stores data temporarily to provide faster access to frequently accessed data. Caches are typically used to reduce the time it takes to retrieve data from a slower storage layer, such as a database or a remote server. The primary goal of caching is to improve performance by minimizing the need to repeatedly fetch data from the original, slower source.

- **What FIFO means:**
  FIFO (First-In, First-Out) is a cache replacement policy where the oldest cached items are replaced first when the cache reaches its limit. This method operates in a queue-like structure where items are added to the end and removed from the front.

- **What LIFO means:**
  LIFO (Last-In, First-Out) is a cache replacement policy where the most recently added items are replaced first when the cache is full. This method functions like a stack, where items are both added and removed from the top.

- **What LRU means:**
  LRU (Least Recently Used) is a cache replacement policy that removes the least recently accessed items first when the cache becomes full. It operates on the assumption that items that haven't been used recently are less likely to be accessed again soon.

- **What MRU means:**
  MRU (Most Recently Used) is a cache replacement policy where the most recently accessed items are replaced first when the cache is full. This policy is typically used in scenarios where the most recently accessed items are likely to be accessed again soon.

- **What LFU means:**
  LFU (Least Frequently Used) is a cache replacement policy where items that are accessed the least frequently are replaced first when the cache reaches its limit. This method prioritizes keeping more frequently accessed items in the cache, assuming they will be needed again.

- **What the purpose of a caching system is:**
  The purpose of a caching system is to improve the efficiency and performance of data retrieval processes by storing frequently accessed data closer to the requesting source (e.g., in memory). This reduces latency, decreases load on slower data sources, and enhances the overall responsiveness of applications.

- **What limits a caching system has:**
  The limitations of a caching system include:
  1. **Limited storage capacity:** Caches have finite storage space, which means not all data can be cached, necessitating the use of cache replacement policies.
  2. **Stale data:** Cached data may become outdated if the underlying data changes, leading to potential inconsistencies.
  3. **Complexity:** Implementing and managing an effective caching system can add complexity to the overall system architecture.
  4. **Cache Misses:** If the data requested is not in the cache (a cache miss), the system may need to fetch it from a slower source, which can temporarily reduce performance.