#!/usr/bin/python3
""" MRUCache module
"""

from base_caching import BaseCaching
from collections import OrderedDict


class MRUCache(BaseCaching):
    """ MRUCache inherits from BaseCaching and is a MRU caching system
    """

    def __init__(self):
        """ Initialize the class
        """
        super().__init__()
        # Use OrderedDict to maintain the order of keys
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is not None and item is not None:
            # If the key new & cache is full, discard the MRU
            if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                newest_key, _ = self.cache_data.popitem(last=True)
                print("DISCARD:", newest_key)

            # If the key already exists, remove it to update the order
            if key in self.cache_data:
                self.cache_data.pop(key)

            # Add the new item (or move the existing item to the end)
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None

        # Move the accessed item to the end to mark it as recently used
        value = self.cache_data.pop(key)
        self.cache_data[key] = value
        return value
