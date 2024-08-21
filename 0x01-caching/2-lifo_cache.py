#!/usr/bin/python3
""" LIFOCache
"""

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFOCache inherits from BaseCaching and is a LIFO caching system
    """

    def __init__(self):
        """ Initialize the class
        """
        super().__init__()
        self.order = []  # List to maintain the order of keys for LIFO

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is not None and item is not None:
            # If the key & cache is full discard the first item
            if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                first_key = self.order.pop()
                del self.cache_data[first_key]
                print("DISCARD:", first_key)

            # If the key already exists, remove it from the order list
            if key in self.order:
                self.order.remove(key)
            # Add the key and item to the cache
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """ Get an item by key
        """
        return self.cache_data.get(key, None)
